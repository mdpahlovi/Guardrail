import type { User } from "better-auth";

export enum QuestionInputType {
    text = "text",
    radio = "radio",
    checkbox = "checkbox",
}

export enum QuestionType {
    mcq = "mcq",
    essay = "essay",
    mixed = "mixed",
}

export type Test = {
    id: string;
    title: string;
    totalCandidates: number;
    totalSlots: number;
    questionSet: number;
    questionType: QuestionType;
    startTime: string;
    endTime: string;
    duration: number;
    negativeMarking: number;
    createdAt: string;
    updatedAt: string;
    createdById: string;
    createdBy?: User;
    questions?: Question[];
    attempts?: TestAttempt[];
};

export type Question = {
    id: string;
    type: QuestionInputType;
    marks: number;
    questionText: string;
    answerText: string;
    correctAnswers: string[];
    order: number;
    testId: string;
    test?: Test;
    options?: Option[];
    answers?: Answer[];
};

export type Option = {
    id: string;
    text: string;
    order: number;
    questionId: string;
    question?: Question;
};

export type TestAttempt = {
    id: string;
    testId: string;
    userId: string;
    startedAt: string;
    submittedAt: string | null;
    isAutoSubmit: boolean;
    tabSwitches: number;
    fullscreenExit: number;
    test?: Test;
    user?: User;
    answers?: Answer[];
};

export type Answer = {
    id: string;
    attemptId: string;
    questionId: string;
    textAnswer: string | null;
    chosen: string[];
    attempt?: TestAttempt;
    question?: Question;
};
