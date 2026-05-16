import { useState, useRef, useEffect } from 'react'

export default function AIAssistantScreen({ nav }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Chào Minh! Mình là Trợ lý AI SaigonFlow 🤖. Thời tiết hôm nay tại Quận 1 khá nóng (32°C). Bạn cần hỗ trợ tìm đường, đặt xe hay kiểm tra ví FlowPass?' },
    { role: 'user', text: 'Tìm đường từ Ga Bến Thành về Thảo Điền giúp mình. Ưu tiên lộ trình tiết kiệm và tránh kẹt xe.' },
    { role: 'bot', text: 'Đã rõ! Để tiết kiệm nhất (25,000₫) và tránh kẹt xe trên cầu Sài Gòn, bạn có thể đi Metro Line 1 đến Ga Thảo Điền (20,000₫), sau đó đi E-bike #E723 cách đó 50m (5,000₫) để về nhà.\n\nThời gian dự kiến: 35 phút. Mình đặt vé Metro và giữ E-bike cho bạn luôn nhé?', hasAction: true }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const [activeRoute, setActiveRoute] = useState(null)
  const [lastVehicleId, setLastVehicleId] = useState(null)

  const handleSend = (overrideText = null) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim()) return;
    
    const userText = textToSend.trim();
    const newMsg = { role: 'user', text: userText }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const lowerInput = userText.toLowerCase();
      const lastBotMsg = messages.filter(m => m.role === 'bot').pop()?.text.toLowerCase() || "";
      
      let botResponse = "";
      let hasAction = false;

      // 1. Handle Route Inquiries (Context-Aware)
      if (lowerInput.includes("đi đâu") || lowerInput.includes("từ đâu") || lowerInput.includes("lộ trình gì") || lowerInput.includes("là gì")) {
        if (activeRoute) {
          botResponse = `Lộ trình tôi đề xuất là đi từ **${activeRoute.from}** đến **${activeRoute.to}**. \n\nCụ thể: Bạn đi Metro Line 1 đến Ga ${activeRoute.to}, sau đó lấy xe E-bike tại trạm cách đó 50m. Bạn thấy lộ trình này ổn không?`;
          hasAction = true;
        } else {
          botResponse = "Hiện tại mình chưa thiết lập lộ trình cụ thể. Bạn muốn đi từ đâu đến đâu để mình gợi ý tuyến đường xanh nhất nhé?";
        }
      } 
      // 2. Handle Traffic
      else if (lowerInput.includes("kẹt xe") || lowerInput.includes("tắc đường")) {
        botResponse = "Dữ liệu giao thông báo cáo mật độ xe cao tại Cầu Sài Gòn và hầm Thủ Thiêm. Lựa chọn Metro + E-bike sẽ giúp bạn tiết kiệm được 20 phút di chuyển.";
      }
      // 3. Handle different choices (Avoid Repetition)
      else if (lowerInput.includes("khác") || lowerInput.includes("đổi")) {
        const vehicles = ["#V0882", "#V0113", "#V0452", "#V0712"];
        let nextVeh = vehicles.find(v => v !== lastVehicleId) || vehicles[0];
        setLastVehicleId(nextVeh);
        botResponse = `Đã đổi! Mình tìm thấy xe E-bike dự phòng mã ${nextVeh} tại trạm phía đối diện (cách 120m). Xe này cũng đầy 95% pin. Bạn muốn giữ xe này không?`;
        hasAction = true;
      }
      // 4. Handle Search Route
      else if (lowerInput.includes("đến") || lowerInput.includes("về") || lowerInput.includes("đi")) {
        const match = lowerInput.match(/(?:tới|đến|về|đi)\s+([\w\s]+)/i);
        let dest = "Thảo Điền";
        if (match && match[1]) {
           dest = match[1].replace(/(giúp|mình|nhé|nha|với|ạ)/g, '').trim();
           dest = dest.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        setActiveRoute({ from: "Ga Bến Thành", to: dest });
        botResponse = `Đã rõ! Lộ trình từ Ga Bến Thành về **${dest}** tối ưu nhất là: \n1. Đi Metro Line 1 (15 phút)\n2. Thuê E-bike tại trạm cuối (5 phút).\n\nTổng chi phí: 25,000₫. Bạn có muốn mình đặt chỗ luôn không?`;
        hasAction = true;
      }
      // 5. Handle Booking
      else if (lowerInput.includes("đặt") || lowerInput.includes("đồng ý") || lowerInput.includes("ok")) {
        botResponse = "Tuyệt vời! Mình đã đặt vé Metro và giữ xe E-bike cho bạn. Mã QR nhận xe đã được gửi vào ví FlowPass. Chúc bạn một chuyến đi xanh và vui vẻ! 🌿";
      }
      // Fallbacks
      else if (lowerInput.includes("ví") || lowerInput.includes("tiền")) {
        botResponse = "FlowPass của bạn hiện có 150,000₫. Đủ cho khoảng 6 chuyến đi Metro + E-bike nữa nhé!";
      }
      else {
        botResponse = "Mình hiểu rồi. Bạn cần mình hỗ trợ thêm gì về lộ trình di chuyển hay kiểm tra dịch vụ nào khác của SaigonFlow không?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse, hasAction: hasAction }])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => nav('home')} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#f1f5f9', border: 'none',
            color: '#1e293b', fontSize: '16px', cursor: 'pointer'
          }}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>🤖</div>
              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid white' }} className="animate-pulse" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>Flow AI</div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>Trực tuyến</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '20px', color: '#94a3b8', cursor: 'pointer' }}>⋮</div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ background: '#e2e8f0', color: '#64748b', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px' }}>HÔM NAY</span>
        </div>

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            maxWidth: '85%'
          }}>
            {msg.role === 'bot' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
            )}
            <div style={{
              background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #0d9488)' : 'white',
              color: msg.role === 'user' ? 'white' : '#1e293b',
              padding: '12px 16px',
              borderRadius: '20px',
              borderTopLeftRadius: msg.role === 'bot' ? '4px' : '20px',
              borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
              fontSize: '13px',
              lineHeight: '1.5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: msg.role === 'bot' ? '1px solid #e2e8f0' : 'none',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
              
              {msg.hasAction && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleSend('Đồng ý đặt.')} style={{ background: '#d1fae5', color: '#059669', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Đồng ý đặt</button>
                  <button onClick={() => handleSend('Cho mình xem lựa chọn khác.')} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Đổi lựa chọn</button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
             <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🤖</div>
             <div style={{ background: 'white', padding: '12px 16px', borderRadius: '20px', borderTopLeftRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }} className="animate-pulse" />
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animationDelay: '0.2s' }} className="animate-pulse" />
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animationDelay: '0.4s' }} className="animate-pulse" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginTop: 'auto' }}>
          {['Tình trạng kẹt xe?', 'Trạm E-bike gần nhất', 'Nạp tiền FlowPass'].map(chip => (
            <button 
              key={chip} 
              onClick={() => handleSend(chip)}
              style={{
                background: 'white', border: '1px solid #10b981', color: '#059669',
                padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                whiteSpace: 'nowrap', cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.1)'
            }}>{chip}</button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#f1f5f9', borderRadius: '24px', padding: '8px 8px 8px 16px'
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi Flow AI bất cứ điều gì..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#1e293b' }}
          />
          <button onClick={handleSend} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: input ? 'linear-gradient(135deg, #10b981, #0d9488)' : '#cbd5e1',
            border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
