// import { useState } from "react";

// export const IconPicker = () => {
//     const [search, setSearch] = useState("");

//     // Filter icons based on user input
//     const filteredIcons = Object.keys(LucideIcons).filter((key) =>
//         key.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="flex-1 overflow-y-auto border-y p-2 scrollbar-thumb-only">
//             {/* Search Bar */}
//             <input
//                 type="text"
//                 placeholder="Search icon..."
//                 className="w-full p-2 mb-2 border rounded"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//             />

//             <ul className="grid grid-cols-4 gap-2">
//                 {filteredIcons.slice(0, 50).map((key) => {  // Display only first 50 icons for performance
//                     const Icon = (LucideIcons as any)[key];
//                     return (
//                         <li key={key} className="p-2 text-center border rounded  hover:bg-accent">
//                             <Icon className="w-6 h-6 mx-auto" />
//                             <p className="text-xs mt-1">{key}</p>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };
