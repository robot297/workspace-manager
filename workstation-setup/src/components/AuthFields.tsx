interface Props {
  authEnabled: boolean;
  username: string;
  token: string;
  onAuthEnabledChange: (v: boolean) => void;
  onUsernameChange: (v: string) => void;
  onTokenChange: (v: string) => void;
}

export function AuthFields({
  authEnabled,
  username,
  token,
  onAuthEnabledChange,
  onUsernameChange,
  onTokenChange,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          id="auth-toggle"
          type="checkbox"
          checked={authEnabled}
          onChange={e => onAuthEnabledChange(e.target.checked)}
          className="w-4 h-4 accent-indigo-500"
        />
        <label htmlFor="auth-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
          Authentication required
        </label>
      </div>

      {authEnabled && (
        <div className="space-y-3 pl-6 border-l-2 border-indigo-200">
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            Credentials are used only to generate config templates — they are never stored or transmitted.
            Values appear as <code className="font-mono">YOUR_USERNAME</code> / <code className="font-mono">YOUR_TOKEN</code> placeholders if left empty.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-username">
              Username <span className="text-gray-400">(placeholder only)</span>
            </label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={e => onUsernameChange(e.target.value)}
              placeholder="YOUR_USERNAME"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-token">
              Token / Password <span className="text-gray-400">(placeholder only)</span>
            </label>
            <input
              id="auth-token"
              type="password"
              value={token}
              onChange={e => onTokenChange(e.target.value)}
              placeholder="YOUR_TOKEN"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
