import { styled } from 'styled-components';
import { ITweet } from './Timeline.tsx';
import { useEffect, useState } from 'react';
import DateAndTime from './DateAndTime.tsx';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 10fr 2fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const LeftBtn = styled.button`
  color: white;
  border-radius: 10px;
  background-color: transparent;
  cursor: pointer;
  border: none;
`;
const RightBtn = styled.button`
  color: white;
  border-radius: 10px;
  background-color: transparent;
  cursor: pointer;
  border: none;
`;

const Column = styled.div``;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Carousel = styled.div`
  display: flex;
  flex-direction: row;
  width: 100px;
  overflow: hidden;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  background-position: center;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const Tweet = ({ userName, photos, tweetText, createDate }: ITweet) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const leftSlide = () => {
    if (photoIndex === 0) return;
    else {
      setPhotoIndex((prevState) => {
        return prevState - 1;
      });
    }
  };

  const rightSlide = () => {
    if (photoUrls?.length - 1 === photoIndex) setPhotoIndex(0);
    else {
      setPhotoIndex((prevState) => {
        return prevState + 1;
      });
    }
  };

  useEffect(() => {
    photos && setPhotoUrls(photos);
  }, [photos]);

  return (
    <Wrapper>
      <Column>
        <Username>{userName}</Username>
        <Payload>{tweetText}</Payload>
      </Column>
      {photos && (
        <Column>
          <Row>
            {photoUrls.length > 1 ? (
              <>
                <LeftBtn onClick={leftSlide}>{'<'}</LeftBtn>
                <Carousel>
                  <Photo src={photoUrls[photoIndex]} />
                </Carousel>
                <RightBtn onClick={rightSlide}>{'>'}</RightBtn>
              </>
            ) : (
              <Carousel>
                <Photo src={photoUrls[photoIndex]} />
              </Carousel>
            )}
          </Row>
        </Column>
      )}
      <Column>
        <DateAndTime initDate={createDate} type={'date'} />
      </Column>
    </Wrapper>
  );
};

export default Tweet;
