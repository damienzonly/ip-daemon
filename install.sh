FILE="ip-daemon.service"
SERVICE_DESC="IP Daemon mailer"
EXEC_START="$(which node) master"
WORKDIR="/opt/ip-daemon"
RESTART="always"
RESTART_SEC=3600
SERVICE_ID="ip-daemon"


rm -rf $FILE
touch $FILE

echo "[Unit]" >> $FILE
echo "Description=\"$SERVICE_DESC\"" >> $FILE
echo "[Service]" >> $FILE
echo "ExecStart=$EXEC_START" >> $FILE
echo "WorkingDirectory=$WORKDIR" >> $FILE
echo "Restart=$RESTART" >> $FILE
echo "RestartSec=$RESTART_SEC" >> $FILE
echo "[Install]" >> $FILE
echo "WantedBy=multi-user.target" >> $FILE

SYSTEM=/etc/systemd/system

systemctl stop $SERVICE_ID
systemctl disable $SERVICE_ID
rm $SYSTEM/$FILE
rm -rf $WORKDIR
systemctl daemon-reload
systemctl reset-failed

mv $FILE $SYSTEM
mkdir -p $WORKDIR
cp src/* $WORKDIR/.
cp package.json $WORKDIR
cd $WORKDIR
npm i
systemctl enable $FILE
systemctl start $FILE