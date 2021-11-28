using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrChat.Hubs
{
public class DrawDotHub: Hub {
   public async Task UpdateCanvas(string user) {
      await Clients.All.SendAsync("updateDot", user);
   }

   public async Task ClearCanvas() {
      await Clients.All.SendAsync("clearCanvas");
   }
}

}