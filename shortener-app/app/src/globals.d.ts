declare module '*.json' {
  let content: any;
  // noinspection JSUnusedGlobalSymbols
  export default content;
}

declare module '*.scss' {
  let content: any;
  // noinspection JSUnusedGlobalSymbols
  export default content;
}

declare module '*.css' {
  let content: Map<String, String>;
  // noinspection JSUnusedGlobalSymbols
  export default content;
}

// eslint-disable-next-line no-unused-vars
interface NodeModule {
  hot: any;
}