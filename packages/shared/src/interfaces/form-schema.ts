export type FieldType =
  | 'header'
  | 'input'
  | 'textarea'
  | 'select'
  | 'photo'
  | 'checklist'
  | 'gps'
  | 'signature'
  | 'group';

export interface BaseField {
  id: string; // uuid
  type: FieldType;
  label?: string;
  required?: boolean;
  order?: number;
  hint?: string;
  meta?: Record<string, any>;
  visibleWhen?: VisibleWhen;
}

export interface VisibleWhen {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in';
  value: any;
}

export interface InputField extends BaseField {
  type: 'input';
  inputType?: 'text' | 'number' | 'email' | 'tel' | 'date';
  validation?: { pattern?: string; min?: number; max?: number };
}

export interface PhotoField extends BaseField {
  type: 'photo';
  multiple?: boolean;
  maxFiles?: number;
  annotate?: boolean; // permitir anotaciones sobre la foto
}

export interface SelectField extends BaseField {
  type: 'select';
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
}

export interface ChecklistField extends BaseField {
  type: 'checklist';
  options: Array<{ id: string; label: string }>;
}

export interface GPSField extends BaseField {
  type: 'gps';
  accuracy?: number;
}

export interface SignatureField extends BaseField {
  type: 'signature';
}

export interface GroupField extends BaseField {
  type: 'group';
  repeatable?: boolean;
  fields: Field[];
}

export type Field =
  | InputField
  | PhotoField
  | SelectField
  | ChecklistField
  | GPSField
  | SignatureField
  | GroupField
  | BaseField;

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  schemaVersion: string; // p.ej. '1.0'
  version: number; // incremento semántico
  fields: Field[];
  createdBy: string;
  createdAt: string;
}
