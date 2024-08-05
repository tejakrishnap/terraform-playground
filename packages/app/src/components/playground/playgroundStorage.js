export const savePlayground = (name, items) => {
    const playgroundData = { items };
    localStorage.setItem(`playground-${name}`, JSON.stringify(playgroundData));
  };
  
  export const loadPlayground = (name) => {
    const data = localStorage.getItem(`playground-${name}`);
    return data ? JSON.parse(data) : { items: [] };
  };