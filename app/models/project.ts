type Project = {
  id: string;
  title: string;
  owner: {
    email: string;
    displayName: string;
  };
  html: string;
  css: string;
  js: string;
  private: boolean;
};
