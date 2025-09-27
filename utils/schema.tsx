import { boolean, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    formData:varchar('formData'),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug'),
    documentId:varchar('documentId'),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt')
})

export const UserSubscription=pgTable('userSubscription',{
    id:serial('id').primaryKey(),
    email:varchar('email'),
    userName:varchar('userName'),
    active:boolean('active'),
    paymentId:varchar('paymentId'),
    joinDate:varchar('joinData')
})

export const DocumentVersions=pgTable('documentVersions',{
    id:serial('id').primaryKey(),
    documentId:varchar('documentId'),
    version:serial('version'),
    content:text('content'),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt'),
    changeDescription:varchar('changeDescription')
})