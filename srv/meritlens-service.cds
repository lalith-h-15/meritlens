
using meritlens from '../db/schema';

type FindingResult {
    findingType : String;
    severity : String;
    description : String;
    rationale : String;
    status : String;
}

type AnalysisResult {
    reviewID : UUID;
    findingsGenerated : Integer;
    findings : many FindingResult;
}

type FindingResolutionResult {
    ID : UUID;
    findingType : String;
    severity : String;
    description : String;
    rationale : String;
    status : String;
}

type CareerContextImportResult {
    reviewID : UUID;
    imported : Integer;
    skipped : Integer;
    status : String;
    message : String;
}

service MeritLensService {
    entity Employees as projection on meritlens.Employees;
    entity Reviews as projection on meritlens.Reviews;
    entity Evidence as projection on meritlens.Evidence;
    entity ContextEntries as projection on meritlens.ContextEntries;
    entity Findings as projection on meritlens.Findings;
    entity AuditLogs as projection on meritlens.AuditLogs;

    action analyseReview(reviewID : UUID) returns AnalysisResult;

    action resolveFinding(
        findingID : UUID,
        decision : String,
        notes : String
    ) returns FindingResolutionResult;
    type ReviewLifecycleResult {
    ID : UUID;
    status : String;
}
action submitReview(reviewID : UUID) returns ReviewLifecycleResult;

action completeReview(reviewID : UUID) returns ReviewLifecycleResult;

    // Pulls approved career context from Career Orchestrator into ContextEntries for ONE review.
    action importCareerContext(reviewID : UUID) returns CareerContextImportResult;
}
