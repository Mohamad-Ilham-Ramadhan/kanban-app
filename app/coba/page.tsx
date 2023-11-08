
export default function Page() {
   return (
      <>
      <header className="fixed z-[1000] top-0 left-0 h-[80px] w-full bg-blue-300 border-b-2 border-b-red-300">Header</header>
      <main className="fixed z-[950] pt-[80px] top-0 left-0 w-screen h-screen bg-green-300 flex flex-row">
         <aside className="w-[300px] bg-blue-300 h-screen shrink-0 overflow-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt inventore libero voluptatum, ea iure officiis recusandae quia aspernatur eum consequuntur iusto nostrum ducimus veritatis tempore perferendis maxime, sint repellat enim.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam, voluptatibus et quidem in est exercitationem sunt maiores rerum rem perspiciatis fugiat nobis optio pariatur ipsum dicta accusamus. Velit, commodi ipsa?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt inventore libero voluptatum, ea iure officiis recusandae quia aspernatur eum consequuntur iusto nostrum ducimus veritatis tempore perferendis maxime, sint repellat enim.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam, voluptatibus et quidem in est exercitationem sunt maiores rerum rem perspiciatis fugiat nobis optio pariatur ipsum dicta accusamus. Velit, commodi ipsa?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt inventore libero voluptatum, ea iure officiis recusandae quia aspernatur eum consequuntur iusto nostrum ducimus veritatis tempore perferendis maxime, sint repellat enim.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam, voluptatibus et quidem in est exercitationem sunt maiores rerum rem perspiciatis fugiat nobis optio pariatur ipsum dicta accusamus. Velit, commodi ipsa?
         </aside>
         <div className="p-8 overflow-auto">
            <div className="flex flex-row">
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
               <div className="bg-gray-300 shrink-0 w-[250px] h-[600px] mr-4"></div>
            </div>
         </div>
      </main>
      </>
   )
}