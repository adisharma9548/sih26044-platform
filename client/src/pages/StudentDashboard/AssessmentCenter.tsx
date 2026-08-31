import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { assessmentService, type AssessmentAttempt, type AssessmentSummary, type StudentAssessment } from '../../services/assessment.service';

export default function AssessmentCenter() {
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [active, setActive] = useState<StudentAssessment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => { try { setLoading(true); setAssessments(await assessmentService.list()); } catch { setError('Unable to load assessments.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const start = async (id: string) => { try { setError(''); setResult(null); const assessment = await assessmentService.get(id); setActive(assessment); setAnswers(Array(assessment.questions.length).fill(-1)); } catch { setError('Unable to open this assessment.'); } };
  const submit = async () => { if (!active || answers.includes(-1)) { setError('Select an answer for every question.'); return; } try { setError(''); const nextResult = await assessmentService.submit(active._id, answers); setResult(nextResult); setActive(null); await load(); } catch { setError('Unable to submit this assessment.'); } };

  return <Card><CardHeader><CardTitle>Skill Assessments</CardTitle></CardHeader><CardContent>
    {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {result && <div className={`mb-4 rounded-lg p-4 ${result.passed ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}><p className="font-semibold">{result.passed ? 'Assessment passed' : 'Assessment complete'}</p><p>Score: {result.score}% ({result.correctAnswers}/{result.totalQuestions} correct){result.skillLevelAwarded ? ` · Skill level: ${result.skillLevelAwarded}` : ''}</p></div>}
    {active ? <div className="space-y-6"><div><h4 className="text-xl font-semibold">{active.title}</h4><p className="text-sm text-gray-500">{active.skillName} · Passing score {active.passingScore}%</p></div>{active.questions.map((question, qIndex) => <fieldset key={question._id} className="rounded-lg border p-4"><legend className="font-medium">{qIndex + 1}. {question.question}</legend><div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => <label key={optionIndex} className="flex cursor-pointer gap-2 text-sm"><input type="radio" name={question._id} checked={answers[qIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index) => index === qIndex ? optionIndex : answer))} />{option}</label>)}</div></fieldset>)}<div className="flex gap-2"><Button onClick={() => void submit()}>Submit assessment</Button><Button variant="outline" onClick={() => setActive(null)}>Cancel</Button></div></div> : loading ? <p className="text-gray-500">Loading assessments…</p> : assessments.length === 0 ? <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No assessments are available yet.</p> : <div className="space-y-3">{assessments.map((assessment) => <div key={assessment._id} className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"><div><p className="font-medium">{assessment.title}</p><p className="text-sm text-gray-500">{assessment.skillName} · {assessment.questionCount} questions · Pass at {assessment.passingScore}%</p>{assessment.attempt && <p className="mt-1 text-sm text-green-700">Completed: {assessment.attempt.score}% {assessment.attempt.passed ? '· Passed' : '· Not passed'}</p>}</div>{assessment.attempted ? <span className="text-sm text-gray-500">Attempt used</span> : <Button size="sm" onClick={() => void start(assessment._id)}>Start assessment</Button>}</div>)}</div>}
  </CardContent></Card>;
}
