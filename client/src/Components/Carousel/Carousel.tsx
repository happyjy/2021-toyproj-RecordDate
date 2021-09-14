import React from 'react';
import useCarousel from './useCarousel';
import styled from 'styled-components';
import { dateImageListType } from '../../types';

/* 캐러셀의 window 역할을 한다. */
type CarouselContainerType = {
  width: number;
};
const CarouselContainer = styled.div<CarouselContainerType>`
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  /* carousel 요소의 width 셋팅이 완료될 때까지 감춘다. */
  opacity: ${({ width }) => (width ? 1 : 0)}; ;
`;

type SlidesType = {
  duration: number;
  currentSlide: number;
};
const Slides = styled.div<SlidesType>`
  /* 수평 정렬 */
  display: flex;
  transition: transform ${({ duration }) => duration}ms ease-out;
  /* transform: translate3D(calc(var(--currentSlide) * -100%), 0, 0); */
  /* transform: translate3D(${({ currentSlide }) =>
    currentSlide * -100}%, 0, 0); */
  transform: translateX(${({ currentSlide }) => currentSlide * -100}%);
`;

type ImgContainerType = {
  width: number;
  height: number;
};
const ImgContainer = styled.div<ImgContainerType>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

type ImgType = {
  width: number;
};
const Img = styled.img<ImgType>`
  padding: 5px;
  width: ${({ width }) => `${width}px`};
  object-fit: cover;
`;

type ControlType = {
  id: string;
};
const Control = styled.button<ControlType>`
  /*
    # POINT: transform: translate가 필요한 이유
      * positon: absolute, top, left: 50%로인해 중앙에 온다
      * 하지만 화살표 버튼 왼쪽 상단이 .clock el의 중앙에 위치(position: top 설정 한거니까)
        (=> Control el이 Container el중앙에 위치 하지 않는다.)
      * Control el의 height의 -50% 만큼 이동해야
        Container el이 정중앙에 올 수 있게 된다.
          - dom 구조
            Contriner
              ㄴ PrevControl(Control상속)
              ㄴ NextControl(Control상속)
  */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2em;
  color: #fff;
  background-color: transparent;
  border-color: transparent;
  cursor: pointer;
  z-index: 99;
  &:focus {
    outline: none;
  }
`;

const PrevControl = styled(Control)`
  left: 0;
`;

const NextControl = styled(Control)`
  right: 0;
`;

// interface CarouselProps {
//   images: dateImageListType[];
// }
/* : React.FC<CarouselProps> */
const Carousel = ({ images }) => {
  const {
    width,
    currentSlide,
    duration,
    isMoving,
    setWidth,
    setIsMoving,
    move,
  } = useCarousel();

  const handleImageLoad = ({ target }) => {
    // if (width !== target.offsetWidth) setWidth(target.offsetWidth);
    setWidth(350);
    move(1);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = event;
    // isMoving 상태를 확인하여 transition 중에는 이동을 허용하지 않는다.
    if (isMoving) return;

    // prev 버튼이 클릭되면 currentSlide를 -1하고 next 버튼이 클릭되면 currentSlide를 +1한다.
    const delta = id === 'prev' ? -1 : 1;
    move(currentSlide + 1 * delta, 500);
  };

  const handleTransitionEnd = () => {
    setIsMoving(false);

    // currentSlide === 0, 즉 선두에 추가한 클론 슬라이드면 currentSlide += images.length로 image의 마지막(images.length)으로 이동
    // currentSlide === images.length + 1, 즉 마자막에 추가한 클론 슬라이드면 currentSlide -= images.length로 image의 선두(1)로 이동
    const delta =
      currentSlide === 0 ? 1 : currentSlide === images.length + 1 ? -1 : 0;

    // 클론 슬라이드가 아니면(delta === 0) 이동하지 않는다.
    if (delta) move(currentSlide + images.length * delta);
  };

  return (
    <CarouselContainer width={width}>
      <Slides
        currentSlide={currentSlide}
        duration={duration}
        onTransitionEnd={handleTransitionEnd}
      >
        {[images[images.length - 1], ...images, images[0]].map((image, i) => (
          <ImgContainer width={width} height={width}>
            <Img
              key={image.id}
              // src={'http://localhost:5000' + image.dateImageName}
              src={image.dateImageName}
              width={width}
              onLoad={handleImageLoad}
            />
          </ImgContainer>
        ))}
      </Slides>
      <PrevControl id="prev" key={1} onClick={(e) => handleClick(e)}>
        &laquo;
      </PrevControl>
      <NextControl id="next" key={2} onClick={(e) => handleClick(e)}>
        &raquo;
      </NextControl>
    </CarouselContainer>
  );
};

export default Carousel;
