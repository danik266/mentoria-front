import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Here we would typically fetch the user profile using the token
  // For simplicity, we just use the token to signify "logged in"
  // but a real app should fetch the user from a /me endpoint
  useEffect(() => {
    const syncData = async () => {
      if (token) {
        // Set basic user immediately and unblock UI rendering
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const email = payload.sub;
          setUser(prev => prev || { email, name: email.split('@')[0] });
        } catch (_) {}
        setLoading(false);

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const email = payload.sub;
          
          const res = await fetch('http://localhost:8000/api/sync', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('mh_profile', JSON.stringify(data.profile));
            localStorage.setItem('mh_progress', JSON.stringify(data.progress));
            localStorage.setItem('mh_saved', JSON.stringify(data.saved));
            localStorage.setItem('mh_courses', JSON.stringify(data.courses));
            localStorage.setItem('mh_opportunities', JSON.stringify(data.opportunities));
            
            const lessonsMap = {};
            data.courses.forEach(c => {
              lessonsMap[c.id] = c.lessons || [];
            });
            localStorage.setItem('mh_lessons', JSON.stringify(lessonsMap));
            
            setUser({
              email: email,
              name: data.profile?.name || email.split('@')[0]
            });
          } else {
            logout();
          }
        } catch (e) {
          console.error("Error syncing data with backend:", e);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    syncData();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    // Помечаем, что у пользователя уже есть аккаунт — чтобы кидать на /login, а не /register
    localStorage.setItem('mh_registered', '1');
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
