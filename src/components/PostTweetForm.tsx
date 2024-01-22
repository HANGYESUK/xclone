import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { auth, database, storage } from '../firebase.ts';

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
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
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
  background-color: #1d9bf0;
  color: white;
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

  const onChangeImagesHandler = (e) => {
    const newFiles = Array.from(e.target.files) as File[];
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
        const uploadFiles = Array.from(tweetData.attachFiles).map((item) => {
          const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${document.id}/${item.name}`);
          return uploadBytes(locationRef, item);
        });
        await Promise.all(uploadFiles);
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
