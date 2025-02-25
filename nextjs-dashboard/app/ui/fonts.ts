import { Inter, Lusitana } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// subset 설정
const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin']
})

export {
  inter,
  lusitana
}