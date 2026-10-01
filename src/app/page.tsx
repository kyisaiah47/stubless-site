import Console from '@/components/Console';
import PageViews from '@/components/site-view/PageViews';
import SimpleHome from '@/components/site-view/SimpleHome';

export default function Home() { return <PageViews consoleView={<Console />} simpleView={<SimpleHome />} />; }
