from rest_framework.throttling import AnonRateThrottle

class PasswordResetRequestThrottle(AnonRateThrottle):
    rate = "5/min"