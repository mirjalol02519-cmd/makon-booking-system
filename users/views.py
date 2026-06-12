from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from .models import TelegramUser
from .serializers import UserSerializer


class CheckMembershipView(APIView):
    def get(self, request, *args, **kwargs):
        telegram_id = request.query_params.get('telegram_id')
        
        if not telegram_id:
            return Response(
                {"detail": "telegram_id parametri yuborilmadi."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            

        BOT_TOKEN = getattr(settings, "BOT_TOKEN", None)
        CHAT_ID = getattr(settings, "GROUP_CHAT_ID", None)
        
        
        if not BOT_TOKEN or not CHAT_ID:
            return Response(
                {"detail": "Server sozlamalarida BOT_TOKEN yoki GROUP_CHAT_ID topilmadi."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"
        params = {
            "chat_id": CHAT_ID,
            "user_id": telegram_id
        }
        
        try:
            response = requests.get(url, params=params).json()
            

            if response.get("ok"):
                status_in_group = response["result"]["status"]
                
                allowed_statuses = ["creator", "administrator", "member"]
                
                if status_in_group in allowed_statuses:
                    return Response({"is_member": True}, status=status.HTTP_200_OK)
                else:
                    return Response({"is_member": False}, status=status.HTTP_200_OK)
            
            else:
                return Response(
                    {
                        "is_member": False, 
                        "telegram_error": response.get("description", "Telegram API xatoligi.")
                    }, 
                    status=status.HTTP_200_OK
                )
                
        except Exception as e:
            return Response(
                {"detail": f"Telegram bilan bog'lanishda tizimli xatolik: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        telegram_id = request.data.get('telegram_id')
        
        username = request.data.get('username', '').replace('@', '')

        user, created = TelegramUser.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'first_name': request.data.get('first_name', ''),
                'last_name': request.data.get('last_name', ''),
                'username': username,
            }
        )
        return Response({'created': created, 'user_id': user.id})


class UserListView(generics.ListAPIView):
    queryset = TelegramUser.objects.all()
    serializer_class = UserSerializer