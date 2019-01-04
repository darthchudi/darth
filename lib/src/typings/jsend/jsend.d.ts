declare module 'jsend' {
  export default interface JSend {
    success(data: any): any;
    fail(data: any): any;
    error(data: any, message: string, code: number): any;
  }
}
