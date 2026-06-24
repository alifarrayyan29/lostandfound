import Sidebar from './Sidebar';

export default function Layout({ children, noPadding = false }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ marginLeft: '240px', minHeight: '100vh' }}
      >
        {noPadding ? (
          children
        ) : (
          <div className="max-w-5xl mx-auto p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
