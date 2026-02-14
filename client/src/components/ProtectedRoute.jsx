import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiJson } from "../lib/api.js";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let alive = true;
    apiJson("/api/auth/me")
      .then((data) => alive && setState({ loading: false, user: data.user }))
      .catch(() => alive && setState({ loading: false, user: null }));
    return () => (alive = false);
  }, []);

  if (state.loading) return <div className="p-6 text-white">Loading...</div>;
  if (!state.user) return <Navigate to="/login" replace />;
  if (adminOnly && state.user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}
