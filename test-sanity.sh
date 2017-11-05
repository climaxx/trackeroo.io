#!/bin/bash
typeset pid_p
typeset pid_c
typeset log_p='rpc-within-producer-callbacks.log'
typeset stdout_p='rpc-within-producer-callbacks.stdout'
typeset log_c='rpc-within-consumer.log'
typeset stdout_c='rpc-within-consumer.stdout'

node example-producer-callbacks.js >"${stdout_p}" &
pid_p=$!
sleep 5
# TODO: Wait for something like
# time="2017-10-10T08:48:11+02:00" level=debug msg="Did successfully write broadcast message"

node consumer-wrapper.js >"${stdout_c}" &
pid_c=$!
sleep 2
# Wait for something like
# time="2017-10-10T08:50:07+02:00" level=debug msg="end rpc.WPWithinHandler.EndServiceDelivery()"

[[ -s "${log_p}" ]] && [[ -s "${log_c}" ]] \
	|| {
	echo "Cannot find logs">&2
	ls -l "${log_p}" "${log_c}"
	ls -l .
	echo "Producer Standard Output:"
	cat "${stdout_p}"
	echo "Consumer Standard Output:"
	cat "${stdout_c}"
	kill `jobs -p`
	exit 1
}

typeset t0=${SECONDS}
typeset t1=$(( ${SECONDS}+120 ))
typeset finished_flag=''
while [[ "${t1}" -gt "${SECONDS}" ]] && [[ -z "${finished_flag}" ]] ; do
	lP=$(cat "${log_p}"\
		|grep 'end hte.ServiceHandlerImpl.ServiceDeliveryEnd()')
	lC=$(cat "${log_c}"\
		|grep 'rpc.WPWithinHandler.EndServiceDelivery')
	if [[ -n "${lP}" ]] && [[ -n "${lC}" ]] ; then
		echo "Transaction successfully ended"
		finished_flag='1'
	fi
	sleep 1
done

kill `jobs -p`

if [[ -n "${finished_flag}" ]] ; then
	echo "success"
	exit 0
else
	echo "Transaction failed" >&2
	echo
	echo "Producer:"
	cat "${stdout_p}"
	echo
	echo "Consumer:"
	cat "${stdout_p}"
	echo
	echo "Producer:"
	cat "${log_p}"
	echo
	echo "Consumer:"
	cat "${log_c}"
	exit 2
fi
