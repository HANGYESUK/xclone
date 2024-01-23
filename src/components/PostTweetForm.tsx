import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, database, storage } from '../firebase.ts';
import { BaseSyntheticEvent } from 'react';

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileLabel = styled.label`
  padding: 10px 0px;
  color: white;
  text-align: center;
  border-radius: 20px;
  border: 1px solid white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFilesInput = styled.input`
  display: none;
`;

const AttachFiles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: none;
  color: white;
  div {
    margin: 10px 0;
  }
`;

const RemoveAttachFile = styled.div`
  cursor: pointer;
  background-color: gray;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 5px 7px;
  border-radius: 50%;
`;

const PostButton = styled.input`
  background-color: #ffffff;
  color: black;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

interface TweetPostForm {
  text: string;
  attachFiles: File[];
}

const PostTweetForm = () => {
  const { watch, reset, register, setValue, handleSubmit } = useForm<TweetPostForm>({
    defaultValues: { attachFiles: [] },
  });

  const attachment = watch('attachFiles');

  const onChangeImagesHandler = (e: BaseSyntheticEvent) => {
    const newFiles = Array.from(e.target.files)?.filter((item) => {
      const isFile = item instanceof File;
      if (isFile && item.size < 1300000) {
        return item;
      } else {
        confirm(`${isFile && item.name}의 용량은 업로드 최대용량을 초과 하였습니다.(최대용량 12MB)`);
      }
    }) as File[];
    setValue('attachFiles', [...Array.from(attachment), ...newFiles]);
  };

  const removeAttachFile = (index: number) => {
    const newAttachment = Array.from(attachment).filter((_, i) => i !== index);
    setValue('attachFiles', newAttachment);
  };

  const onSubmit = async (tweetData: TweetPostForm) => {
    const user = auth.currentUser;
    if (tweetData.text.length === 0) return;
    try {
      const document = await addDoc(collection(database, 'tweet'), {
        tweetText: tweetData.text,
        createDate: Date.now(),
        userName: user?.displayName || 'Anonymous',
        userId: user?.uid,
      });
      if (tweetData.attachFiles.length > 0) {
        const urls: string[] = [];
        const uploadFiles = Array.from(tweetData.attachFiles).map((item) => {
          const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${document.id}/${item.name}`);
          return (async () => {
            const result = await uploadBytes(locationRef, item);
            const url = await getDownloadURL(result.ref);
            urls.push(url);
          })();
        });
        await Promise.all(uploadFiles);
        await updateDoc(document, {
          photos: urls,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      reset();
    }
  };

  return (
    <PostForm onSubmit={handleSubmit(onSubmit)}>
      <TextArea {...register('text', { maxLength: 500 })}></TextArea>
      {Array.from(attachment)?.map((attachFile, index) => {
        return (
          <AttachFiles key={`index-${index}`}>
            <div>{attachFile?.name}</div>
            <RemoveAttachFile onClick={() => removeAttachFile(index)}>X</RemoveAttachFile>
          </AttachFiles>
        );
      })}
      <AttachFileLabel htmlFor={'file'}>
        이미지 첨부
        <AttachFilesInput
          {...register('attachFiles')}
          onChange={onChangeImagesHandler}
          type={'file'}
          id={'file'}
          multiple={true}
          accept={'image/*'}
        />
      </AttachFileLabel>
      <PostButton type={'submit'} value={'트윗'}></PostButton>
    </PostForm>
  );
};

export default PostTweetForm;
