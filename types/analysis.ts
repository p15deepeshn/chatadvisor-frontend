export interface AnalysisResult {
  summary: string;
  risk: string | null;
  best_reply: string;
  alternative_reply: string;
  avoid_saying: string;
}
