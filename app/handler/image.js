import Image from './../struct/Image';

export type ImageType = {
  Id: string,
  ParentId: string,
  RepoTags: string[],
  RepoDigests: ?string[],
  Created: number,
  Size: number,
  VirtualSize: number,
  SharedSize: number,
  Labels: Object,
  Containers: number
};

export default function transform(rawData: ImageType): Image {
  let image = new Image(rawData.RepoTags[0]);
  // remove id algorithm prefix ( format is sha256:<id> )
  image.id = rawData.Id.split(':').pop();
  image.status = 'Ready';

  return image;
}