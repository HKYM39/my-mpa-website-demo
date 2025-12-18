import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type { UserVO } from "./types/user";

const API_BASE = (process.env.API_BASE_URL as string | undefined) ?? "/api";

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function App() {
  const [users, setUsers] = useState<UserVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ email: "", name: "" });
  const [mutating, setMutating] = useState(false);

  const [githubToken, setGithubToken] = useState("");
  const [githubUser, setGithubUser] = useState<Record<string, unknown> | null>(
    null
  );
  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubOpen, setGithubOpen] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        (user.name ?? "").toLowerCase().includes(term) ||
        String(user.id).includes(term)
    );
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }
      const data: UserVO[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.email.trim()) {
      setError("请填写邮箱后再提交。");
      return;
    }

    setMutating(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`创建失败：${response.status}`);
      }

      setForm({ email: "", name: "" });
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setMutating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setMutating(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`删除失败：${response.status}`);
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setMutating(false);
    }
  };

  const openGithub = async () => {
    setGithubOpen(true);
    setGithubLoading(true);
    setGithubError(null);
    setGithubUser(null);

    if (!githubToken.trim()) {
      setGithubError("请输入 GitHub Token 后再获取。");
      setGithubLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        const message =
          response.status === 401
            ? "Token 无效或已过期"
            : `获取失败：${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      setGithubUser(data);
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : "获取失败");
    } finally {
      setGithubLoading(false);
    }
  };

  const closeGithub = () => {
    setGithubOpen(false);
    setGithubUser(null);
    setGithubError(null);
  };

  const columns = ["id", "email", "name"] as const;

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">用户中心 · CRUD + GitHub</p>
          <h1>轻盈用户面板</h1>
          <p className="subtitle">
            直连 <code>{API_BASE}</code>，展示后端 VO 字段（id / email /
            name），支持增删查，外加 GitHub Token 信息弹窗。
          </p>
          <div className="actions">
            <button
              className="btn ghost"
              type="button"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? "刷新中..." : "刷新数据"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={openGithub}
              disabled={githubLoading}
            >
              查看 GitHub 信息
            </button>
          </div>
        </div>
        <div className="github-box">
          <p>GitHub Token</p>
          <input
            type="password"
            placeholder="ghp_xxx"
            value={githubToken}
            onChange={(event) => setGithubToken(event.target.value)}
          />
          <small>仅用于调用 GitHub /user 接口，不会外传。</small>
        </div>
      </header>

      <section className="panel">
        <form className="toolbar" onSubmit={handleSearch}>
          <div className="field">
            <label htmlFor="keyword">查询</label>
            <input
              id="keyword"
              type="text"
              placeholder="支持 email/name/id 本地筛选"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn ghost" type="submit" disabled={loading}>
              筛选
            </button>
          </div>
        </form>

        <form className="new-item" onSubmit={handleAdd}>
          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              placeholder="example@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="name">昵称</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="可选"
            />
          </div>
          <button className="btn" type="submit" disabled={mutating}>
            {mutating ? "处理中..." : "新增"}
          </button>
        </form>

        {error ? <div className="alert">{error}</div> : null}

        <div className="table-wrapper">
          {loading ? (
            <div className="empty">加载中...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">暂无数据，试试刷新或新增吧。</div>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>{formatValue(user.id)}</td>
                    <td>{formatValue(user.email)}</td>
                    <td>{formatValue(user.name)}</td>
                    <td>
                      <button
                        className="btn danger"
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        disabled={mutating}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {githubOpen ? (
        <div className="modal-backdrop" onClick={closeGithub}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <h3>GitHub 账号信息</h3>
              <button className="close" type="button" onClick={closeGithub}>
                ×
              </button>
            </header>
            {githubLoading ? <p>拉取中...</p> : null}
            {githubError ? <p className="alert">{githubError}</p> : null}
            {githubUser ? (
              <div className="github-grid">
                <div>
                  <span className="label">登录名</span>
                  <strong>{formatValue(githubUser.login)}</strong>
                </div>
                <div>
                  <span className="label">昵称</span>
                  <strong>{formatValue(githubUser.name)}</strong>
                </div>
                <div>
                  <span className="label">邮箱</span>
                  <strong>{formatValue(githubUser.email)}</strong>
                </div>
                <div>
                  <span className="label">仓库数</span>
                  <strong>{formatValue(githubUser.public_repos)}</strong>
                </div>
                <div>
                  <span className="label">所在地</span>
                  <strong>{formatValue(githubUser.location)}</strong>
                </div>
                <div>
                  <span className="label">ID</span>
                  <strong>{formatValue(githubUser.id)}</strong>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
