export interface IBoard {
  id?: number;
  title?: string;
  content?: string;
  writer?: string;
  date?: string;
  img_path?: string;
  imageContentType?: string;
  image?: any;
  imageName?: string;
}

export class Board implements IBoard {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public writer?: string,
    public date?: string,
    public img_path?: string,
    public imageContentType?: string,
    public image?: any,
    public imageName?: string
  ) {}
}
