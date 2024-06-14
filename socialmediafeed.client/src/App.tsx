import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

import {
    Container
} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
    addPost,
    deletePost,
    getPosts
} from './requests';

import {
    FormInput,
    Post,
    SimplePost
} from './interfaces';

import AppForm from './components/AppForm';
import AppCard from './components/AppCard';

function App() {
    const [posts, setPosts] = useState<Post[]>();

    const [postToAdd, setPostToAdd] = useState<SimplePost>({
        content: ''
    });

    const populatePosts = useCallback(async () => {
        const data = await getPosts();

        setPosts(data);
    }, []);

    const executeAddPost = useCallback(async () => {
        await addPost(postToAdd);

        setPostToAdd({
            content: ''
        });

        await populatePosts();
    }, [postToAdd, populatePosts]);

    const executeDeletePost = useCallback(async (post: Post) => {
        await deletePost(post);

        await populatePosts();
    }, [populatePosts]);

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        populatePosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contents = useMemo(() => posts === undefined
        ? <p><em>Loading...</em></p>
        : posts.map(post =>
            <AppCard
                key={post.id}
                header={post.userId}
                footer={new Date(post.createdAt).toLocaleString()}
                text={post.content}
                onClose={post.canDelete ? () => executeDeletePost(post) : undefined}
                className="mb-3"
            />
        ), [executeDeletePost, posts]);

    const inputs = useMemo<FormInput<SimplePost>[]>(() => [
        {
            field: 'content',
            label: 'Content',
            type: 'textarea',
            required: true
        }
    ], []);

    return (
        <Container fluid>
            <h1>Social media feed</h1>

            <AppForm
                inputs={inputs}
                data={postToAdd}
                setData={setPostToAdd}
                onSubmit={executeAddPost}
                className="mb-3"
            />

            {contents}
        </Container>
    );
}

export default App;