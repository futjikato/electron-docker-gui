import Container from './../struct/Container';

export type ContainerType = {
  Id: string,
  Image: string,
  ImageID: string,
  Command: string,
  Created: number,
  State: string,
  Status: string
};

export default function transform(rawData: ContainerType): Container {
  const container = new Container(rawData.Command, rawData.Image);
  container.id = rawData.Id;
  container.status = rawData.State;
  container.isRunning = (rawData.State === "running");
  container.createdDate = new Date(rawData.Created * 1000);

  return container;
}