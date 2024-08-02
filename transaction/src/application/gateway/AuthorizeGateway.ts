export interface AuthorizeGateway {
  authorize(): Promise<Output>;
}

export type Output = {
  status: string;
};
