export interface IComment {
  id: string;
  articleId?: string;
  parentId?: string;
  content: string;
  date: string;
  email?: string;
  name?: string;
  replies?: IComment[];
}

export interface IBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  comments?: number;
}

export interface IProject {
  id: string;
  title: string;
  content: string;
  client: string;
  url: string;
  tags: string[];
  image: string;
}

export interface ITask {
  id: string;
  task: string;
  column: string; // "backlog" | "todo" | "inProgress" | "completed";
  date: string;
}
