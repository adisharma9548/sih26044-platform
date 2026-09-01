export const StudentRoadmap: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-h1 font-bold">Career Roadmap</h1>
    <p className="text-body text-muted">Your personalized journey from skill gap to job ready.</p>
    <div className="space-y-4">
      {['Current State', 'Skill Gap', 'Learning', 'Practice', 'Assessment', 'Internship', 'Job Ready'].map((step, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{i+1}</div>
          <span className="font-medium">{step}</span>
          <div className="flex-1 h-1 bg-primary/20 rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: i < 4 ? '60%' : '100%' }} /></div>
        </div>
      ))}
    </div>
  </div>
);