export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>TeamStack Kanban</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', minWidth: '250px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>To Do</h3>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0, fontWeight: '500' }}>Build user auth</p>
            <span style={{ fontSize: '12px', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px' }}>high</span>
          </div>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', minWidth: '250px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>In Progress</h3>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>No tasks</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', minWidth: '250px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Done</h3>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>No tasks</p>
        </div>
      </div>
    </div>
  )
}
