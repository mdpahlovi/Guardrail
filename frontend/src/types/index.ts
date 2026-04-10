import type { User } from "better-auth";

export enum QuestionInputType {
    text = "text",
    radio = "radio",
    checkbox = "checkbox",
}

export enum QuestionType {
    Standard = "Standard",
    Adaptive = "Adaptive",
}

export type Test = {
    id: string;
    title: string;
    totalCandidates: number;
    totalSlots: number;
    questionSet: number;
    questionType: QuestionType;
    startTime: Date;
    endTime: Date;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    createdBy?: User; // Optional unless fetched via include
    questions?: Question[]; // Optional unless fetched via include
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
};

export type Option = {
    id: string;
    text: string;
    order: number;
    questionId: string;
    question?: Question;
};
