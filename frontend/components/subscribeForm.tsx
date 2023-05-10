export default function SubscribeForm() {
  return (
    <form action="/subscribing" method="get" className="flex justify-center">
      <input 
        required
        id="email"
        type="email"
        name="email"
        placeholder="メールアドレス" 
        className="w-full max-w-xs bg-gray-50 text-gray-800 border border-black py-1 px-1 mr-2 leading-tight focus:outline-none focus:bg-white"
      />
      <div>
        <button type="submit" className="subscribe-button">
          登録する
        </button>
      </div>
    </form>
  )
}