// import { createClient } from '@/utils/supabase/server';
// import { useState } from 'react';
// import { useFormContext } from 'react-hook-form';

// interface DynamicSelectInputProps {
//   name: string;
//   label: string;
//   placeholder: string;
//   fetchUrl: string;
//   saveUrl: string;
// }

// const PerxSelect: React.FC<DynamicSelectInputProps> = ({
//   name,
//   label,
//   placeholder,
//   fetchUrl,
//   saveUrl,
// }) => {
//   const { control, setValue } = useFormContext();
//   const [options, setOptions] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const supabase = await createClient();
//       }
//     }
//   })
// };
