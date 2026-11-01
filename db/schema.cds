using { cuid, managed } from '@sap/cds/common';

namespace meritlens;

// 1. Employee profiles
entity Employees : cuid, managed {
    employeeCode : String(30);
    firstName    : String(80) not null;
    lastName     : String(80) not null;
    department   : String(100);
    jobTitle     : String(100);
    managerId    : String(100);
    active       : Boolean default true;
}

// 2. Performance reviews
entity Reviews : cuid, managed {
    employee       : Association to Employees not null;
    reviewerId     : String(100) not null;
    reviewPeriod   : String(50) not null;
    status         : String(30) default 'DRAFT';
    managerSummary : LargeString;
    employeeInput  : LargeString;
}

// 3. Supporting evidence
entity Evidence : cuid, managed {
    review       : Association to Reviews not null;
    evidenceType : String(50) not null;
    sourceSystem : String(50);
    sourceRef    : String(255);
    title        : String(255) not null;
    description  : LargeString;
    evidenceDate : Date;
    verified     : Boolean default false;
}

// 4. Context that helps explain an employee's work
entity ContextEntries : cuid, managed {
    review       : Association to Reviews not null;
    contextType  : String(50) not null;
    description  : LargeString not null;
    reportedBy   : String(100);
    contextDate  : Date;
}

// 5. Potential issues identified during review analysis
entity Findings : cuid, managed {
    review       : Association to Reviews not null;
    findingType  : String(50) not null;
    severity     : String(20) default 'INFO';
    description  : LargeString not null;
    rationale    : LargeString;
    status       : String(30) default 'OPEN';
}

// 6. Audit history
entity AuditLogs : cuid, managed {
    review       : Association to Reviews;
    actorId      : String(100);
    action       : String(100) not null;
    details      : LargeString;
}