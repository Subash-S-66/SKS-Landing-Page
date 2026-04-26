import os

filepath = "frontend/components/sections/Chatbot.tsx"
with open(filepath, "r") as f:
    content = f.read()

search = """              {/* FAQ Options (Only show if last message is from bot to keep it clean) */}
              <div className="flex flex-col gap-2 mt-4">
                {faqs.map(faq => (
                  <button
                    key={faq._id}
                    onClick={() => handleQuestionClick(faq)}
                    className="text-left text-sm text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>"""

replace = """              {/* FAQ Options (Only show if last message is from bot to keep it clean) */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                <div className="flex flex-col gap-2 mt-4">
                  {faqs.map(faq => (
                    <button
                      key={faq._id}
                      onClick={() => handleQuestionClick(faq)}
                      className="text-left text-sm text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              )}"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, "w") as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Search string not found")
