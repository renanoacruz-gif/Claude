import time
import os
import sys
import threading
from datetime import datetime

LOG_FILE = "pomodoro_log.txt"
WORK_MINUTES = 25
CONTINUE_MINUTES = 10
PAUSE_MINUTES = 5


def beep(times=1):
    for _ in range(times):
        sys.stdout.write("\a")
        sys.stdout.flush()
        time.sleep(0.2)


def clear():
    os.system("cls" if os.name == "nt" else "clear")


def log(tarefa, status):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | {tarefa} | {status}\n")


def contar_tempo(minutos, tarefa):
    total_segundos = minutos * 60
    print(f"\nFoco em: {tarefa}")
    print(f"Timer de {minutos} minuto(s) iniciado. Boa sorte!\n")
    for restante in range(total_segundos, 0, -1):
        mins, secs = divmod(restante, 60)
        print(f"\r⏳ {mins:02d}:{secs:02d} restantes", end="", flush=True)
        time.sleep(1)
    print("\r⏰ Tempo esgotado!                  ")


def perguntar_com_beep(tarefa):
    resposta_container = {"valor": None}

    def ler_input():
        resposta_container["valor"] = input().strip().lower()

    thread = threading.Thread(target=ler_input, daemon=True)
    thread.start()

    while thread.is_alive():
        print(f"\n🚨 Tempo esgotado! Você terminou a tarefa '{tarefa}'? (Digite 'sim' ou 'nao'): ", end="", flush=True)
        beep(3)
        thread.join(timeout=10)

    return resposta_container["valor"]


def perguntar_sim_nao(tarefa):
    while True:
        resposta = perguntar_com_beep(tarefa)
        if resposta in ("sim", "nao"):
            return resposta
        print("Resposta inválida. Digite apenas 'sim' ou 'nao'.")


def escolher_continuar_ou_pausa():
    while True:
        print("\nVocê ainda não terminou. Sem desculpas, foco!")
        print("1 - Continuar mais 10 minutos")
        print("2 - Pausa de 5 minutos")
        escolha = input("Escolha (1 ou 2): ").strip()
        if escolha in ("1", "2"):
            return escolha
        print("Opção inválida.")


def main():
    print("=== Cobrador de Pomodoro ===")
    while True:
        tarefa = input("\nQual a tarefa atual? ").strip()
        if not tarefa:
            print("Tarefa não pode ser vazia.")
            continue

        minutos = WORK_MINUTES
        while True:
            contar_tempo(minutos, tarefa)
            resposta = perguntar_sim_nao(tarefa)

            if resposta == "sim":
                clear()
                log(tarefa, "Concluída com sucesso")
                print(f"✅ Tarefa '{tarefa}' registrada como concluída em {LOG_FILE}.")
                break
            else:
                log(tarefa, "Não concluída")
                escolha = escolher_continuar_ou_pausa()
                if escolha == "1":
                    minutos = CONTINUE_MINUTES
                else:
                    print(f"\nPausa de {PAUSE_MINUTES} minutos. Aproveite!")
                    contar_tempo(PAUSE_MINUTES, "Pausa")
                    minutos = WORK_MINUTES


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nEncerrado pelo usuário.")
