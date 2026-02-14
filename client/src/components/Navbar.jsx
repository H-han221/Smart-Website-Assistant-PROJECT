export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between">
      <h1>AI Chat Assistant</h1>
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </div>
  );
}
