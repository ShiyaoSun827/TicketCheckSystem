import { getShowById } from "@/lib/user-dashboard-actions";
import Image from "next/image";

interface PageProps {
  params: { showId: string };
}

export default async function TicketPage({ params }: PageProps) {
  const show = await getShowById(params.showId);
  if (!show) return <div className="p-6 text-red-600">❌ 无法找到排片信息</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎫 购买 《{show.movie.name}》 的票</h1>

      <div className="flex gap-6">
        {show.movie.image && (
          <Image
            src={show.movie.image}
            alt={show.movie.name}
            width={200}
            height={300}
            className="rounded shadow"
          />
        )}

        <div>
          <p>🎬 电影名称：{show.movie.name}</p>
          <p>📅 时间：{new Date(show.beginTime).toLocaleString()}</p>
          <p>⌛ 时长：{Math.round(show.movie.length / 60)} 分钟</p>
          <p>💰 票价：$12.00（可动态配置）</p>
        </div>
      </div>

      {/* 购票表单可放这里 */}
    </div>
  );
}
