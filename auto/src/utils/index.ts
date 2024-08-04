import {largestRect} from 'rect-scaler';

export interface AspectRatio {
  ratio: number,
  label: string,
  ratioClass: string,
}

const getUsableDimensions = (container: HTMLElement) => {
  const containerComputedStyle = getComputedStyle(container);
  const containerPaddingX =
    parseInt(containerComputedStyle.paddingLeft.replace('px', ''), 10) +
    parseInt(containerComputedStyle.paddingRight.replace('px', ''), 10);
  const containerPaddingY =
    parseInt(containerComputedStyle.paddingTop.replace('px', ''), 10) +
    parseInt(containerComputedStyle.paddingBottom.replace('px', ''), 10);

  const containerWidth = container.offsetWidth - containerPaddingX;
  const containerHeight = container.offsetHeight - containerPaddingY;

  return {containerWidth, containerHeight};
};

const resizer = (container: HTMLElement, {width, height, margin}: {
  width: number,
  height: number,
  margin: number,
}) => {
  const children = Array.from(container.children) as HTMLElement[];
  for (const child of children) {
    child.style.width = `${width}px`;
    child.style.height = `${height}px`;
    child.style.margin = `${margin / 2}px`;
    child.className = 'video-box';
  }
};

export const resize = (container: HTMLElement, margin: number, aspectRatio: AspectRatio) => {

  const tileCount = container.children.length;
  if (!tileCount) return;
  const containerDimensions = getUsableDimensions(container);

  const aspectArray = aspectRatio.label.split(':');
  const aspectWidth = Number(aspectArray[0]);
  const aspectHeight = Number(aspectArray[1]);
  const containerWidth = containerDimensions.containerWidth as number;
  const containerHeight = containerDimensions.containerHeight as number;

  const dimensions = largestRect(
    containerWidth,
    containerHeight,
    tileCount,
    aspectWidth,
    aspectHeight,
  );

  const width = dimensions.width - margin;
  const height = dimensions.height - margin;
  resizer(container, {
    width,
    height,
    margin,
  });
};
