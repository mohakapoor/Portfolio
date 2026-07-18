export type Source = {
  repo: string;
  path: string;
  type: string;
  symbol: string;
};

export type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: Source[];
};
