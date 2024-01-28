import { styled } from 'styled-components';
import { ITweet } from './Timeline.tsx';
import { useEffect, useState } from 'react';
import DateAndTime from './DateAndTime.tsx';
import { auth, storage, database } from '../firebase.ts';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { deleteDoc, doc } from 'firebase/firestore';
import { Column, Row } from './commonStyle.ts';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 20px 0;
  overflow-y: scroll;
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

const TweetText = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

interface TweetType extends ITweet {
  canDelete?: boolean;
}

const Tweet = ({ userId, userName, photos, tweetText, createDate, id, canDelete }: TweetType) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const user = auth.currentUser;

  const onDelete = async () => {
    const isConfirm = confirm('게시글을 삭제 하시겠습니까??');
    if (!isConfirm || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(database, 'tweet', id));
      if (photos) {
        const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
        listAll(photoRef).then((response) => {
          response.items.forEach(async (url) => {
            await deleteObject(url);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      <Column style={{ margin: '10px 0' }}>
        <Row>
          <Username>작성자 : {userName}</Username>
          {canDelete ? <DeleteButton onClick={onDelete}>삭제</DeleteButton> : null}
        </Row>
      </Column>
      <Row>
        <TweetText>{tweetText}</TweetText>
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
      </Row>
      <Column>
        <DateAndTime initDate={createDate} type={'date'} />
      </Column>
    </Wrapper>
  );
};

export default Tweet;
