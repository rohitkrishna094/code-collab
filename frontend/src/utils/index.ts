export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const copyToClipboard = (content: any) => {
  const el = document.createElement('textarea');
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
