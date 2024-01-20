import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { auth, database } from '../firebase.ts';

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
  border: none;
  color: white;
  div {
    margin: 10px 10px;
  }
`;

const RemoveAttachFile = styled.button`
  cursor: pointer;
  background-color: tomato;
  border: none;
  color: white;
  border-radius: 10px;
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

  const addImagesHandler = (e) => {
    setValue('attachFiles', [...attachment, ...e.currentTarget.files]);
  };

  const removeAttachFile = (name: string) => {
    setValue(
      'attachFiles',
      attachment.filter((item) => item.name !== name),
    );
  };

  const onSubmit = async (tweetData: TweetPostForm) => {
    const user = auth.currentUser;
    if (tweetData.text.length < 0) return;
    try {
      await addDoc(collection(database, 'tweet'), {
        tweetText: tweetData.text,
        createDate: Date.now(),
        userName: user?.displayName || 'Anonymous',
        userId: user?.uid,
      });
    } catch (e) {
      console.log(e);
    } finally {
      reset();
    }
  };

  return (
    <PostForm onSubmit={handleSubmit(onSubmit)}>
      <TextArea {...register('text', { maxLength: 500 })}></TextArea>
      {attachment.map((attachFile, index) => {
        return (
          <AttachFiles key={`index-${index}`}>
            <div>{attachFile?.name}</div>
            <RemoveAttachFile onClick={() => removeAttachFile(attachFile.name)}>삭제</RemoveAttachFile>
          </AttachFiles>
        );
      })}
      <AttachFileLabel htmlFor={'file'} onChange={addImagesHandler}>
        이미지 첨부
        <AttachFilesInput {...register('attachFiles')} type={'file'} id={'file'} accept={'image/*'} />
      </AttachFileLabel>
      <PostButton type={'submit'} value={'트윗'}></PostButton>
    </PostForm>
  );
};

export default PostTweetForm;
