"use client";

import Link from "next/link"
import {
  CircleUser,
  Menu,
  Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { LoaderCircle } from 'lucide-react'
import {  useEffect, useState  } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";

interface chat {
  type: string,
  message: string
}

export default function MainApp() {

    const [query, setQuery] = useState("");
    const [file, setFile] = useState(null);
    const [list, setList] = useState<chat[]>([]);
    const [sideList, setSideList] = useState<chat[][]>([]);

    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
        }
    };

    useEffect(() => {

      ( async () => {

        const response = await axios.get('/api/getChats', {
          withCredentials: true
        }); 
        if(response.data.status == 200){
          setSideList(response.data.chats);
        }
      
      })()

    },[])

    const logout = async () => {
      const response = await axios.get('/api/logout', {
        withCredentials: true
      });

      if(response.data.status == 200){
        router.push('/signin');
      }
    }

    const onSubmit = async (e: any) => {
      if(!loading){
        e.preventDefault();
        setLoading(true);
        if(file && query){

            setList( (prev) => [...prev,{ type: "User", message: query }]);
            let recent = [{ type: "User", message: query }];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('query', query);

            const response = await fetch('http://127.0.0.1:5000/api/execute', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json()
            setLoading(false);
            setList( (prev) => [...prev,{ type: "Bot", message: result.answer }]);
            setQuery("");
            recent = [...recent, { type: "Bot", message: result.answer }]
            await axios.post('/api/saveChats', {
              recents: recent
            },{
              withCredentials: true,
            });
            setSideList( (prev) => [...prev,recent] );
        }
        else{
            setLoading(false);
            console.log("file and query both are required");
        }
      }

    }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">RAG-GPT</span>
            </Link>
          </div>

          <div className="flex-1">
            <h2 className="p-2 m-2">Recent chats</h2>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <ScrollArea className="rounded-md border h-[450px]" >
              { sideList.slice().reverse().map((chat, index) => {
                return <div key={index} onClick={() => setList(chat) } className="m-2 p-1 rounded-md cursor-pointer hover:bg-gray-700 duration-100 transition-all">
                  {chat[0].message.length > 25 ? `${chat[0].message.slice(0,25)} ...` : chat[0].message}
                </div>
              })}
            </ScrollArea>
            </nav>
          </div>

        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between  md:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <h2 className="p-2">Recent chats</h2>
              <nav className="grid gap-2 text-lg font-medium">
              
              <ScrollArea className="rounded-md border h-[450px]" >
                { sideList.slice().reverse().map((chat, index) => {
                  return <div key={index} onClick={() => setList(chat) } className="m-2 p-1 rounded-md cursor-pointer hover:bg-gray-700 duration-100 transition-all">
                    {chat[0].message.length > 25 ? `${chat[0].message.slice(0,25)} ...` : chat[0].message}
                  </div>
                })}
              </ScrollArea>

              </nav>
              
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col justify-between gap-4 p-4 lg:gap-6 lg:p-6">
            <div>
                <ScrollArea className="rounded-md border h-[450px]" >
                    <div className="p-4 flex flex-col gap-2">
                        <h1 className="mb-4 text-2xl leading-none">Chats</h1>
                        {
                          list.map((chat, index) => {
                            if(chat.type == "User"){
                              return <div key={index} className="self-end p-3 max-w-3xl border-white/50 border rounded-md">
                                  {chat.message}
                              </div>
                            }
                            else{
                              return <div key={index} className="self-start p-3 max-w-3xl border-white/50 border rounded-md">
                                  {chat.message}
                              </div>
                            }
                          })
                        }
                        {loading && <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>}
                        
                    </div>
                </ScrollArea>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={(e) => {
                setQuery('Given the following array of reviews, identify the main topics and themes');
              }} >Main Topics</Button>
              <Button variant="secondary" onClick={(e) => {
                setQuery('Please extract all the pros mentioned in these reviews and calculate the percentage of positive reviews. A review is considered positive if it mentions good quality, performance, value, or a recommendation');
              }} >Pros</Button>
              <Button variant="secondary" onClick={(e) => {
                setQuery('Please extract all the cons mentioned in these reviews and calculate the percentage of negative reviews. A review is considered negative if it mentions bad quality, performance issues, or not recommended');
              }} >Cons</Button>
              <Button variant="secondary" onClick={(e) => {
                setQuery('You are given a list of product reviews. For each review, identify the best thing mentioned about the product.');
              }} >Best Thing</Button>
              <Button variant="secondary" onClick={(e) => {
                setQuery('Please extract the main con about the product from these reviews. Identify the most frequently mentioned negative aspect.');
              }} >Main Con</Button>
            </div>
            <form onSubmit={onSubmit} className="flex gap-5">
                <Input type="file" accept=".txt" onChange={ handleFileChange } className="w-34 cursor-pointer"/>
                <Input type="text" value={query} onChange={ (e) => setQuery(e.target.value) } placeholder="query" />
                <Button>{ loading ? <LoaderCircle className="animate-spin" /> :  `Submit`}</Button>
            </form>
        </main>
      </div>
    </div>
  )
}
