import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSet } from "@/components/ui/field";

// Notification settings type
interface NotificationSettings {
  whatsapp: {
    enabled: boolean;
    phone: string;
    deadlineReminder: boolean;
    testReminder: boolean;
    interviewReminder: boolean;
    statusUpdate: boolean;
  };
  telegram: {
    enabled: boolean;
    chatId: string;
    deadlineReminder: boolean;
    testReminder: boolean;
    interviewReminder: boolean;
    statusUpdate: boolean;
  };
}

const NotificationSetting = () => {
  const [isLoading] = useState(false);

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    whatsapp: {
      enabled: false,
      phone: "",
      deadlineReminder: true,
      testReminder: true,
      interviewReminder: true,
      statusUpdate: true,
    },
    telegram: {
      enabled: false,
      chatId: "",
      deadlineReminder: true,
      testReminder: true,
      interviewReminder: true,
      statusUpdate: true,
    },
  });

  const updateWhatsappSetting = (
    key: keyof NotificationSettings["whatsapp"],
    value: boolean | string
  ) => {
    setNotifications((prev) => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [key]: value,
      },
    }));
  };

  const updateTelegramSetting = (
    key: keyof NotificationSettings["telegram"],
    value: boolean | string
  ) => {
    setNotifications((prev) => ({
      ...prev,
      telegram: {
        ...prev.telegram,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for saving settings
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pointer-events-none opacity-60 select-none"
    >
      <FieldSet disabled={isLoading} className="space-y-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Notifikasi</CardTitle>
            <CardDescription>
              Atur notifikasi untuk deadline lamaran, jadwal tes, interview, dan
              update status melalui WhatsApp atau Telegram.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {/* WhatsApp Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi via WhatsApp
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.whatsapp.enabled}
                  onCheckedChange={(checked) =>
                    updateWhatsappSetting("enabled", checked)
                  }
                />
              </div>

              {notifications.whatsapp.enabled && (
                <div className="space-y-4 pl-[52px]">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-phone">Nomor WhatsApp</Label>
                    <Input
                      id="whatsapp-phone"
                      value={notifications.whatsapp.phone}
                      onChange={(e) =>
                        updateWhatsappSetting("phone", e.target.value)
                      }
                      placeholder="628123456789"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: 628xxxxx (tanpa tanda + atau spasi)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Jenis Notifikasi
                    </Label>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Pengingat Deadline Lamaran
                      </span>
                      <Switch
                        checked={notifications.whatsapp.deadlineReminder}
                        onCheckedChange={(checked) =>
                          updateWhatsappSetting("deadlineReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pengingat Jadwal Tes</span>
                      <Switch
                        checked={notifications.whatsapp.testReminder}
                        onCheckedChange={(checked) =>
                          updateWhatsappSetting("testReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Pengingat Jadwal Interview
                      </span>
                      <Switch
                        checked={notifications.whatsapp.interviewReminder}
                        onCheckedChange={(checked) =>
                          updateWhatsappSetting("interviewReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update Status Lamaran</span>
                      <Switch
                        checked={notifications.whatsapp.statusUpdate}
                        onCheckedChange={(checked) =>
                          updateWhatsappSetting("statusUpdate", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Telegram Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Send className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Telegram</h4>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi via Telegram
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.telegram.enabled}
                  onCheckedChange={(checked) =>
                    updateTelegramSetting("enabled", checked)
                  }
                />
              </div>

              {notifications.telegram.enabled && (
                <div className="space-y-4 pl-[52px]">
                  <div className="space-y-2">
                    <Label htmlFor="telegram-chatid">Chat ID Telegram</Label>
                    <Input
                      id="telegram-chatid"
                      value={notifications.telegram.chatId}
                      onChange={(e) =>
                        updateTelegramSetting("chatId", e.target.value)
                      }
                      placeholder="123456789"
                    />
                    <p className="text-xs text-muted-foreground">
                      Dapatkan Chat ID dengan mengirim pesan ke @userinfobot di
                      Telegram
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Jenis Notifikasi
                    </Label>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Pengingat Deadline Lamaran
                      </span>
                      <Switch
                        checked={notifications.telegram.deadlineReminder}
                        onCheckedChange={(checked) =>
                          updateTelegramSetting("deadlineReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pengingat Jadwal Tes</span>
                      <Switch
                        checked={notifications.telegram.testReminder}
                        onCheckedChange={(checked) =>
                          updateTelegramSetting("testReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Pengingat Jadwal Interview
                      </span>
                      <Switch
                        checked={notifications.telegram.interviewReminder}
                        onCheckedChange={(checked) =>
                          updateTelegramSetting("interviewReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update Status Lamaran</span>
                      <Switch
                        checked={notifications.telegram.statusUpdate}
                        onCheckedChange={(checked) =>
                          updateTelegramSetting("statusUpdate", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FieldSet>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};

export default NotificationSetting;
