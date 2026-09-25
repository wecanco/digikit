/* تعریف تایپ CSS Modules برای type-check مستقل پکیج (در Next از next-env.d.ts می‌آید) */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
